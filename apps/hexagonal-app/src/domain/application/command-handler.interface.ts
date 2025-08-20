// Interface pure pour les command handlers - aucune dépendance infrastructure
export interface ICommand {
  // Marqueur pour les commandes
}

export interface ICommandHandler<TCommand extends ICommand> {
  execute(command: TCommand): Promise<void>;
}

export interface IQuery {
  // Marqueur pour les requêtes
}

export interface IQueryHandler<TQuery extends IQuery, TResult = any> {
  execute(query: TQuery): Promise<TResult>;
}

// Interface pour publier les événements
export const EVENT_PUBLISHER = 'EVENT_PUBLISHER';

export interface IEventPublisher {
  publish(event: any): Promise<void>;
  publishAll(events: any[]): Promise<void>;
}
